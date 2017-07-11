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
    [RoutePrefix("api/borrows")]
    public class BorrowsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/borrows
        [Route("", Name = "GetBorrows")]
        public IQueryable<Borrow> GetBorrows()
        {
            return db.Borrows;
        }

        // GET: api/borrows/5
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

        [Route("user/{id}", Name = "GetBooksByUserId")]
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

        // PUT: api/borrows/5
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

        // POST: api/borrows
        [ResponseType(typeof(Borrow))]
        [Route("")]
        public async Task<IHttpActionResult> PostBorrow(BorrowInfoDTO borrow)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = db.Users.Find(borrow.UserId);
            if (user == null)
            {
                throw new Exception("user not exist.");
            }

            var borrows = new List<Borrow>();
            foreach (Guid bookId in borrow.Books)
            {  
                Borrow newBorrow = new Borrow
                {
                    BorrowId = Guid.NewGuid(),
                    UserId = borrow.UserId,
                    BookId= bookId,
                    StartDate = DateTime.Now,
                    EndDate = new DateTime(1970, 1, 1)
                };

                db.Borrows.Add(newBorrow);
                borrows.Add(newBorrow);

                var book = db.Books.Find(bookId);
                if (book != null)
                {
                    book.AvailableCopies--;
                }
                else {
                    throw new Exception("book not exist.");
                }

                user.BorrowedBooksCount++;
            }

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            Uri locationHeader = new Uri(Url.Link("GetBorrows", null));
            return Created(locationHeader, borrows);
        }

        // DELETE: api/borrows/5
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