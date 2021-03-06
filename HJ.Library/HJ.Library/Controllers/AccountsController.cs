﻿using HJ.Library.Infrastructure;
using HJ.Library.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace HJ.Library.Controllers
{
    [RoutePrefix("api/accounts")]
    [Authorize]// Require authenticated requests
    public class AccountsController: BaseApiController
    {
        //About roles
        //[Authorize( Roles = "Enabled" )]
        //[Authorize( Roles = "Editor,Admin" )] //内部是or 的关系，两个Authorize Attribute之间是与的关系

        [Authorize(Roles="Admin")]
        [Route("users")]
        public IHttpActionResult GetUsers()
        {
            // Use UserReturnModel to hide sensitive information
            return Ok(this.AppUserManager.Users.ToList().Select(u => this.TheModelFactory.Create(u)));
        }

        [Route("logout")]
        [HttpGet]
        public IHttpActionResult Logout()
        {
            try {
                HttpContext.Current.GetOwinContext().Authentication.SignOut();
                return Ok();
            }
            catch {
                return InternalServerError();
            }
        }

        // Authorize to all users, they can use user id to get user details
        [Route( "user/id/{id}", Name = "GetUserById" )]
        //In Web API, every route has a name. Route names are useful for generating links, so that you can include a link in an HTTP response，
        //for example, refer to ModelFactory.cs, like: Url = this.urlHelper.Link( "GetRoleById", new { id = appRole.Id } )
        public async Task<IHttpActionResult> GetUser(string Id)
        {
            var user = await this.AppUserManager.FindByIdAsync(Id);

            if (user != null)
            {
                return Ok(this.TheModelFactory.Create(user));
            }

            return NotFound();
        }

        // Get logged on user id, and use this id to get user details. Instead of athorizing all users the right to 
        // get user details by userName, it's much safter to get them by user id since it's just a Guid string
        [Route("user/getCurrentUserId")]
        public IHttpActionResult GetCurrentUserId()
        {
            return Ok(User.Identity.GetUserId());
        }

        [Authorize(Roles="Admin")]
        [Route("user/name/{userName}")]
        // In AspNetUsers data table, the UserName column has been set as Unique, Non-clustered index, so from the database definition, this column is unique
        public async Task<IHttpActionResult> GetUserByName(string userName)
        {
            var user = await this.AppUserManager.FindByNameAsync(userName);

            if (user != null)
            {
                return Ok(this.TheModelFactory.Create(user));
            }

            return NotFound();
        }

        [Authorize(Roles="Admin")]
        [Route( "user" )]
        public async Task<IHttpActionResult> PutUser( UpdatingUserDto userModel )
        {
            var appUser = await this.AppUserManager.FindByIdAsync( userModel.Id );

            if ( appUser != null )
            {
                appUser.FirstName = userModel.FirstName;
                appUser.LastName = userModel.LastName;

                IdentityResult updateUserResult = await this.AppUserManager.UpdateAsync( appUser );
                if ( !updateUserResult.Succeeded )
                {
                    return GetErrorResult( updateUserResult );
                }

                IHttpActionResult assignRolesResult = await this.AssignRolesToUser( userModel.Id, userModel.RoleName.Split(',') );
                return assignRolesResult;
            }

            return NotFound();
        }

        [Authorize(Roles = "Admin")]
        [Route("create")]
        public async Task<IHttpActionResult> CreateUser(CreatingUserDto userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser()
            {
                UserName = userModel.UserName,
                Email = userModel.Email,
                FirstName = userModel.FirstName,
                LastName = userModel.LastName,
                BorrowedBooksCount = 0,
                EmailConfirmed = true // Currently, don't consider email confirming
            };

            IdentityResult addUserResult = await this.AppUserManager.CreateAsync(user, userModel.Password);

            if (!addUserResult.Succeeded)
            {
                return GetErrorResult(addUserResult);
            }

            var newUser = this.AppUserManager.FindByName( userModel.UserName );
            this.AppUserManager.AddToRoles( newUser.Id, userModel.RoleName.Split( ',' ) );

            Uri locationHeader = new Uri(Url.Link("GetUserById", new { id = user.Id }));

            return Created(locationHeader, TheModelFactory.Create(user));
        }

        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Logged on user can update its password, so we can use the 'User' here to get the user id. -- User.Identity.GetUserId()
            IdentityResult result = await this.AppUserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [Authorize(Roles="Admin")]
        [Route("user/{id:guid}")]
        public async Task<IHttpActionResult> DeleteUser(string id)
        {
            // Only SuperAdmin or Admin can delete users (Later when implement roles)
            var appUser = await this.AppUserManager.FindByIdAsync(id);

            if (appUser != null)
            {
                IdentityResult result = await this.AppUserManager.DeleteAsync(appUser);
                if (!result.Succeeded)
                {
                    return GetErrorResult(result);
                }

                return Ok();
            }

            return NotFound();
        }

        [Authorize(Roles="Admin")]
        [Route("user/{id:guid}/roles")]
        [HttpPut]
        public async Task<IHttpActionResult> AssignRolesToUser( [FromUri] string id, [FromBody] string[] rolesToAssign )
        {
            var appUser = await this.AppUserManager.FindByIdAsync( id );
            if ( appUser == null )
            {
                return NotFound();
            }

            var currentRoles = await this.AppUserManager.GetRolesAsync( appUser.Id );
            var rolesNotExist = rolesToAssign.Except( this.AppRoleManager.Roles.Select( x => x.Name ) ).ToArray();

            if ( rolesNotExist.Count() > 0 )
            {
                ModelState.AddModelError( "", string.Format( "Roles '{0}' does not exist in the system", string.Join( ",", rolesNotExist ) ) );
                return BadRequest( ModelState );
            }

            IdentityResult removeResult = await this.AppUserManager.RemoveFromRolesAsync( appUser.Id, currentRoles.ToArray() );
            if ( !removeResult.Succeeded )
            {
                ModelState.AddModelError( "", "Failed to remove user roles" );
                return BadRequest( ModelState );
            }

            IdentityResult addResult = await this.AppUserManager.AddToRolesAsync( appUser.Id, rolesToAssign );
            if ( !addResult.Succeeded )
            {
                ModelState.AddModelError( "", "Failed to add user roles" );
                return BadRequest( ModelState );
            }

            return Ok();
        }
    }
}