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
    builder.EntitySet<Book>("BooksOData");
    builder.EntitySet<Borrow>("Borrows"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class BooksODataController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/BooksOData
        [EnableQuery]
        public IQueryable<Book> GetBooksOData()
        {
            return db.Books;
        }

        // GET: odata/BooksOData(5)
        [EnableQuery]
        public SingleResult<Book> GetBook([FromODataUri] Guid key)
        {
            return SingleResult.Create(db.Books.Where(book => book.BookId == key));
        }

        // PUT: odata/BooksOData(5)
        public async Task<IHttpActionResult> Put([FromODataUri] Guid key, Delta<Book> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Book book = await db.Books.FindAsync(key);
            if (book == null)
            {
                return NotFound();
            }

            patch.Put(book);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(book);
        }

        // POST: odata/BooksOData
        public async Task<IHttpActionResult> Post(Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Books.Add(book);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (BookExists(book.BookId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(book);
        }

        // PATCH: odata/BooksOData(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] Guid key, Delta<Book> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Book book = await db.Books.FindAsync(key);
            if (book == null)
            {
                return NotFound();
            }

            patch.Patch(book);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(book);
        }

        // DELETE: odata/BooksOData(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] Guid key)
        {
            Book book = await db.Books.FindAsync(key);
            if (book == null)
            {
                return NotFound();
            }

            db.Books.Remove(book);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/BooksOData(5)/BeBorrowedRecords
        [EnableQuery]
        public IQueryable<Borrow> GetBeBorrowedRecords([FromODataUri] Guid key)
        {
            return db.Books.Where(m => m.BookId == key).SelectMany(m => m.BeBorrowedRecords);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookExists(Guid key)
        {
            return db.Books.Count(e => e.BookId == key) > 0;
        }
    }
}
