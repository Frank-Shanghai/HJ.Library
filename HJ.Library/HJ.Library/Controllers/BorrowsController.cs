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
    [RoutePrefix("api/borrows")]
    public class BorrowsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Borrows
        public IQueryable<Borrow> GetBorrows()
        {
            return db.Borrows;
        }

        // GET: api/Borrows/5
        [ResponseType(typeof(Borrow))]
        [Route("{id:guid}", Name = "GetBorrowById")]
        public async Task<IHttpActionResult> GetBorrow(Guid id)
        {
            Borrow borrow = await db.Borrows.FindAsync(id);
            if (borrow == null)
            {
                return NotFound();
            }

            return Ok(borrow);
        }

        [Route("user/{id}", Name="GetBooksByUserId")]
        public IList<Borrow> GetBorrowsByUserId(string userId)
        {
            IEnumerable<Borrow> borrows = from b in db.Borrows
                                          where b.UserId == userId
                                          select b;
            if (borrows == null || borrows.Count() == 0)
            {
                return null;
            }

            return borrows.ToList<Borrow>();
        }

        // PUT: api/Borrows/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutBorrow(Guid id, Borrow borrow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != borrow.BorrowId)
            {
                return BadRequest();
            }

            db.Entry(borrow).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BorrowExists(id))
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

        // POST: api/Borrows
        [ResponseType(typeof(Borrow))]
        [Route("")]
        public async Task<IHttpActionResult> PostBorrow(Borrow borrow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            borrow.BorrowId = System.Guid.NewGuid();
            db.Borrows.Add(borrow);

            var book = db.Books.Find(borrow.BookId);
            if (book != null)
            {
                book.AvailableCopies--;
            }

            var user = db.Users.Find(borrow.UserId);
            if (user != null)
            {
                user.BorrowedBooksCount++;
            }

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

            Uri locationHeader = new Uri(Url.Link("GetBorrowById", new { id = borrow.BookId }));
            return Created(locationHeader, borrow);
        }

        // DELETE: api/Borrows/5
        [ResponseType(typeof(Borrow))]
        public async Task<IHttpActionResult> DeleteBorrow(Guid id)
        {
            Borrow borrow = await db.Borrows.FindAsync(id);
            if (borrow == null)
            {
                return NotFound();
            }

            db.Borrows.Remove(borrow);
            await db.SaveChangesAsync();

            return Ok(borrow);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BorrowExists(Guid id)
        {
            return db.Borrows.Count(e => e.BorrowId == id) > 0;
        }
    }
}