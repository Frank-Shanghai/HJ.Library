using HJ.Library.Infrastructure;
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
    public class AccountsController: BaseApiController
    {
        [Authorize(Roles="Admin")]
        [Route("users")]
        public IHttpActionResult GetUsers()
        {
            // Use UserReturnModel to hide sensitive information
            return Ok(this.AppUserManager.Users.ToList().Select(u => this.TheModelFactory.Create(u)));
        }

        [Authorize(Roles="Admin")]
        [Route( "user/{id:guid}", Name = "GetUserById" )]
        //name 是路由名称，可以用asp.net razor语法在页面中生成url，如@Url.RouteUrl("GetUserById"). 在这个project中客户端用不到，
        //但在服务器端有用到， 见ModelFactory.cs, 如： Url = this.urlHelper.Link( "GetRoleById", new { id = appRole.Id } )
        public async Task<IHttpActionResult> GetUser(string Id)
        {
            var user = await this.AppUserManager.FindByIdAsync(Id);

            if (user != null)
            {
                return Ok(this.TheModelFactory.Create(user));
            }

            return NotFound();
        }

        [Authorize(Roles="Admin")]
        [Route("user/{userName}")]
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

        [AllowAnonymous]
        [Route("create")]
        public async Task<IHttpActionResult> CreateUser(CreateUserBindingModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser() 
            {
                UserName = userModel.UserName,
                Email=userModel.Email
            };

            IdentityResult addUserResult = await this.AppUserManager.CreateAsync(user, userModel.Password);

            if (!addUserResult.Succeeded)
            {
                return GetErrorResult(addUserResult);
            }

            Uri locationHeader = new Uri(Url.Link("GetUserById", new { id = user.Id }));

            return Created(locationHeader, TheModelFactory.Create(user));
        }

        [Authorize]
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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