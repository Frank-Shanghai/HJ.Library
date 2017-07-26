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
using HJ.Library.Models;

namespace HJ.Library.Controllers
{
    [Authorize]// Require authenticated requests
    [RoutePrefix("api/books")]
    public class BooksController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/books
        [Route( "" )]
        public IQueryable<Book> GetBooks()
        {
            return db.Books;
        }

        // GET: api/books/query
        [Route("query")]
        public List<Book> GetBooksByQueryData([FromUri] string queryString)
        {
            BooksQueryDTO queryData = Newtonsoft.Json.JsonConvert.DeserializeObject<BooksQueryDTO>(queryString);

            List<Book> results = db.Books.ToList<Book>();
            if (queryData != null && string.IsNullOrWhiteSpace(queryData.Keyword) == false)
            {
                if (queryData.QueryOptions.Count == 0 || queryData.QueryOptions.Contains(BooksQueryOption.All))
                {
                    results = (from b in results
                               where (b.Name.IndexOf(queryData.Keyword, StringComparison.InvariantCultureIgnoreCase) > -1) || b.Author.IndexOf(queryData.Keyword, StringComparison.InvariantCultureIgnoreCase) > -1 ||
                               b.ISBN.IndexOf(queryData.Keyword, StringComparison.InvariantCultureIgnoreCase) > -1 || b.Publisher.IndexOf(queryData.Keyword, StringComparison.InvariantCultureIgnoreCase) > -1
                               select b).ToList();
                }
                else
                {
                    if (queryData.QueryOptions.Contains(BooksQueryOption.Title))
                    {
                        results = (from b in results
                                   where b.Name.IndexOf(queryData.Keyword, StringComparison.InvariantCultureIgnoreCase) > -1
                                   select b).ToList();
                    }

                    if (queryData.QueryOptions.Contains(BooksQueryOption.Author))
                    {
                        results = (from b in results
                                   where b.Author.IndexOf(queryData.Keyword, StringComparison.InvariantCultureIgnoreCase) > -1
                                   select b).ToList();
                    }

                    if (queryData.QueryOptions.Contains(BooksQueryOption.ISBN))
                    {
                        results = (from b in results
                                   where b.ISBN.IndexOf(queryData.Keyword, StringComparison.InvariantCultureIgnoreCase) > -1
                                   select b).ToList();
                    }

                    if (queryData.QueryOptions.Contains(BooksQueryOption.Publisher))
                    {
                        results = (from b in results
                                   where b.Publisher.IndexOf(queryData.Keyword, StringComparison.InvariantCultureIgnoreCase) > -1
                                   select b).ToList();
                    }
                }
            }

            return results;        
        }

        // GET: api/books/5
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

        // PUT: api/books/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(void))]
        [Route( "{id:guid}", Name = "UpdateBook" )]
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

        // POST: api/books
        [Authorize( Roles = "Admin" )]
        [ResponseType(typeof(Book))]
        [Route( "" )]
        public async Task<IHttpActionResult> PostBook(Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            book.BookId = System.Guid.NewGuid();

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

        // DELETE: api/books/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Book))]
        [Route("{id:guid}", Name = "DeleteBook")]
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