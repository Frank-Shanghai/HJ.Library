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

namespace HJ.Library.ODataControllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using HJ.Library.Infrastructure;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Borrow>("BorrowsOData");
    builder.EntitySet<Book>("Books"); 
    builder.EntitySet<ApplicationUser>("ApplicationUsers"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class BorrowsODataController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/BorrowsOData
        [EnableQuery]
        public IQueryable<Borrow> GetBorrowsOData()
        {
            return db.Borrows;
        }

        // GET: odata/BorrowsOData(5)
        [EnableQuery]
        public SingleResult<Borrow> GetBorrow([FromODataUri] Guid key)
        {
            return SingleResult.Create(db.Borrows.Where(borrow => borrow.BorrowId == key));
        }

        // PUT: odata/BorrowsOData(5)
        public async Task<IHttpActionResult> Put([FromODataUri] Guid key, Delta<Borrow> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Borrow borrow = await db.Borrows.FindAsync(key);
            if (borrow == null)
            {
                return NotFound();
            }

            patch.Put(borrow);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BorrowExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(borrow);
        }

        // POST: odata/BorrowsOData
        public async Task<IHttpActionResult> Post(Borrow borrow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Borrows.Add(borrow);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (BorrowExists(borrow.BorrowId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(borrow);
        }

        // PATCH: odata/BorrowsOData(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] Guid key, Delta<Borrow> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Borrow borrow = await db.Borrows.FindAsync(key);
            if (borrow == null)
            {
                return NotFound();
            }

            patch.Patch(borrow);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BorrowExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(borrow);
        }

        // DELETE: odata/BorrowsOData(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] Guid key)
        {
            Borrow borrow = await db.Borrows.FindAsync(key);
            if (borrow == null)
            {
                return NotFound();
            }

            db.Borrows.Remove(borrow);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/BorrowsOData(5)/Book
        [EnableQuery]
        public SingleResult<Book> GetBook([FromODataUri] Guid key)
        {
            return SingleResult.Create(db.Borrows.Where(m => m.BorrowId == key).Select(m => m.Book));
        }

        // GET: odata/BorrowsOData(5)/User
        [EnableQuery]
        public SingleResult<ApplicationUser> GetUser([FromODataUri] Guid key)
        {
            return SingleResult.Create(db.Borrows.Where(m => m.BorrowId == key).Select(m => m.User));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BorrowExists(Guid key)
        {
            return db.Borrows.Count(e => e.BorrowId == key) > 0;
        }
    }
}
