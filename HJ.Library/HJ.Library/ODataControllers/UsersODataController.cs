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

using Microsoft.AspNet.Identity.EntityFramework;

namespace HJ.Library.ODataControllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using HJ.Library.Infrastructure;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<ApplicationUser>("UsersOData");
    builder.EntitySet<Borrow>("Borrows"); 
    builder.EntitySet<IdentityUserClaim>("IdentityUserClaims"); 
    builder.EntitySet<IdentityUserLogin>("IdentityUserLogins"); 
    builder.EntitySet<IdentityUserRole>("IdentityUserRoles"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class UsersODataController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/UsersOData
        [EnableQuery]
        public IQueryable<ApplicationUser> GetUsersOData()
        {
            return db.ApplicationUsers;
        }

        // GET: odata/UsersOData(5)
        [EnableQuery]
        public SingleResult<ApplicationUser> GetApplicationUser([FromODataUri] string key)
        {
            return SingleResult.Create(db.ApplicationUsers.Where(applicationUser => applicationUser.Id == key));
        }

        // PUT: odata/UsersOData(5)
        public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<ApplicationUser> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ApplicationUser applicationUser = await db.ApplicationUsers.FindAsync(key);
            if (applicationUser == null)
            {
                return NotFound();
            }

            patch.Put(applicationUser);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationUserExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(applicationUser);
        }

        // POST: odata/UsersOData
        public async Task<IHttpActionResult> Post(ApplicationUser applicationUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ApplicationUsers.Add(applicationUser);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ApplicationUserExists(applicationUser.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(applicationUser);
        }

        // PATCH: odata/UsersOData(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<ApplicationUser> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ApplicationUser applicationUser = await db.ApplicationUsers.FindAsync(key);
            if (applicationUser == null)
            {
                return NotFound();
            }

            patch.Patch(applicationUser);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationUserExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(applicationUser);
        }

        // DELETE: odata/UsersOData(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        {
            ApplicationUser applicationUser = await db.ApplicationUsers.FindAsync(key);
            if (applicationUser == null)
            {
                return NotFound();
            }

            db.ApplicationUsers.Remove(applicationUser);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/UsersOData(5)/BorrowRecords
        [EnableQuery]
        public IQueryable<Borrow> GetBorrowRecords([FromODataUri] string key)
        {
            return db.ApplicationUsers.Where(m => m.Id == key).SelectMany(m => m.BorrowRecords);
        }

        // GET: odata/UsersOData(5)/Claims
        [EnableQuery]
        public IQueryable<IdentityUserClaim> GetClaims([FromODataUri] string key)
        {
            return db.ApplicationUsers.Where(m => m.Id == key).SelectMany(m => m.Claims);
        }

        // GET: odata/UsersOData(5)/Logins
        [EnableQuery]
        public IQueryable<IdentityUserLogin> GetLogins([FromODataUri] string key)
        {
            return db.ApplicationUsers.Where(m => m.Id == key).SelectMany(m => m.Logins);
        }

        // GET: odata/UsersOData(5)/Roles
        [EnableQuery]
        public IQueryable<IdentityUserRole> GetRoles([FromODataUri] string key)
        {
            return db.ApplicationUsers.Where(m => m.Id == key).SelectMany(m => m.Roles);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ApplicationUserExists(string key)
        {
            return db.ApplicationUsers.Count(e => e.Id == key) > 0;
        }
    }
}
