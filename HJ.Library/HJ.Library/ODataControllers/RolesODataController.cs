using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using HJ.Library.Infrastructure;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity;

using Microsoft.AspNet.Identity.EntityFramework;

namespace HJ.Library.ODataControllers
{
    public class RolesODataController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
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

        [EnableQuery]
        public IQueryable<IdentityRole> GetRolesOData()
        {
            return db.Roles;
        }

        public SingleResult<IdentityRole> GetRole([FromODataUri] string key)
        {
            return SingleResult.Create(db.Roles.Where(role => role.Id == key));
        }
    }
}