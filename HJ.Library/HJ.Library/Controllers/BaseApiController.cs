using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using HJ.Library.Infrastructure;
using System.Net.Http;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity;
using HJ.Library.Models;

namespace HJ.Library.Controllers
{
    public class BaseApiController: ApiController
    {
        private ModelFactory modelFactory;
        private ApplicationUserManager appUserManager = null;
        private ApplicationRoleManager appRoleManager = null;

        protected ApplicationUserManager AppUserManager
        {
            get
            {
                return this.appUserManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
        }

        protected ApplicationRoleManager AppRoleManager
        {
            get 
            {
                return this.appRoleManager ?? Request.GetOwinContext().GetUserManager<ApplicationRoleManager>();
            }
        }

        public BaseApiController() { }

        protected ModelFactory TheModelFactory
        {
            get
            {
                if (modelFactory == null)
                {
                    modelFactory = new ModelFactory(this.Request, this.AppUserManager);
                }

                return this.modelFactory;
            }
        }

        protected IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("unexpected", error);
                    }
                }

                if (ModelState.IsValid)
                { 
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}