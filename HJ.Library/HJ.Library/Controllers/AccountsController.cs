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
        [Route("users")]
        public IHttpActionResult GetUsers()
        {
            // Use UserReturnModel to hide sensitive information
            return Ok(this.AppUserManager.Users.ToList().Select(u => this.TheModelFactory.Create(u)));
        }

        [Route( "user/{id:guid}", Name = "GetUserById" )]
        public async Task<IHttpActionResult> GetUser(string Id)
        {
            var user = await this.AppUserManager.FindByIdAsync(Id);

            if (user != null)
            {
                return Ok(this.TheModelFactory.Create(user));
            }

            return NotFound();
        }

        [Route("user/{userName}")]
        public async Task<IHttpActionResult> GetUserByName(string userName)
        {
            var user = await this.AppUserManager.FindByNameAsync(userName);

            if (user != null)
            {
                return Ok(this.TheModelFactory.Create(user));
            }

            return NotFound();
        }

        [Route("create")]
        public async Task<IHttpActionResult> CreateUser(UserBindingModel userModel)
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

        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(string currentPassword, string newPassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await this.AppUserManager.ChangePasswordAsync(User.Identity.GetUserId(), currentPassword, newPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [Route("user/{id: guid}")]
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
    }
}