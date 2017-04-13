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
using System.Web.Http.Description;
using HJ.Library.Infrastructure;

namespace HJ.Library.Controllers
{
    [Authorize]// Require authenticated requests
    [RoutePrefix("api/books")]
    public class BooksController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Books
        [Route( "" )]
        public IQueryable<Book> GetBooks()
        {
            return db.Books;
        }

        // GET: api/Books/5
        [ResponseType(typeof(Book))]
        [Route( "{id:guid}", Name = "GetBookById" )]
        public async Task<IHttpActionResult> GetBook(Guid id)
        {
            Book book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // PUT: api/Books/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutBook(Guid id, Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != book.BookId)
            {
                return BadRequest();
            }

            db.Entry(book).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Books
        [Authorize( Roles = "Admin" )]
        [ResponseType(typeof(Book))]
        [Route( "" )]
        public async Task<IHttpActionResult> PostBook(Book book)
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

            Uri locationHeader = new Uri( Url.Link( "GetBookById", new { id = book.BookId } ) );
            return Created( locationHeader, book );
       }

        // DELETE: api/Books/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Book))]
        public async Task<IHttpActionResult> DeleteBook(Guid id)
        {
            Book book = await db.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            db.Books.Remove(book);
            await db.SaveChangesAsync();

            return Ok(book);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BookExists(Guid id)
        {
            return db.Books.Count(e => e.BookId == id) > 0;
        }
    }
}