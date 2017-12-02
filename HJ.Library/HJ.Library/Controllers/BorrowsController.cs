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
    [Authorize]
    public class BorrowsController : BaseApiController
    {
        private static object thisLock = new object();
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/borrows
        [Route("", Name = "GetBorrows")]
        public IQueryable<Borrow> GetBorrows()
        {
            return db.Borrows;
        }

        // POST: api/borrows/includeAll
        // I take it as an post instead of get because it's not easy to handle complex data structure with http get.
        // To use get, you can use [FromUri] to get parameters from URL, because get will append data to the URL instead of request body,
        // but get can just handle simple data type like int/string. 
        // Another solution is json serialize the object and take it as one singe parameter as data like {query: json.stringify({..}}, and 
        // on serverside you can de-serialize the json object into one .net object
        // Refer to http://www.cnblogs.com/landeanfen/p/5337072.html#_label0_1
        // In borrow books page (BooksController.cs), I am going to use the json serialization and de-serialization way to implement book searching

        // But a http post will be much simple
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("records/includeAll", Name = "GetBorrowsIncludeBookAndUser")]
        public object GetBorrowsIncludeBookAndUser(dynamic parameters)// Returned books
        {
            // By specifying the end date year not equals to 1970, make sure it's returned book.
            var results = db.Borrows.Where(b => b.EndDate.Year != 1970).Include("Book").Include("User");
            BorrowingRecordQueryDTO queryData = Newtonsoft.Json.JsonConvert.DeserializeObject<BorrowingRecordQueryDTO>(Convert.ToString(parameters.customQueryParameters));
            if (queryData != null)
            {
                queryData.EndDate = queryData.EndDate.AddDays(1);
                if (queryData.DateQueryOptions.Count == 0 || queryData.DateQueryOptions.Count > 1)
                {
                    results = (from b in db.Borrows.Include("Book").Include("User")
                               where b.EndDate.Year != 1970
                               && b.StartDate >= queryData.StartDate && b.StartDate < queryData.EndDate
                               && b.EndDate >= queryData.StartDate && b.EndDate < queryData.EndDate
                               select b);
                }
                else
                {
                    switch (queryData.DateQueryOptions[0])
                    {
                        case BorrowingRecordDateQueryOption.BorrowedDate:
                            results = (from b in db.Borrows.Include("Book").Include("User")
                                       where b.EndDate.Year != 1970
                                       && b.StartDate >= queryData.StartDate && b.StartDate < queryData.EndDate
                                       select b);
                            break;
                        case BorrowingRecordDateQueryOption.ReturnedDate:
                            results = (from b in db.Borrows.Include("Book").Include("User")
                                       where b.EndDate.Year != 1970
                                       && b.EndDate >= queryData.StartDate && b.EndDate < queryData.EndDate
                                       select b);
                            break;
                    }
                }

                if (!string.IsNullOrWhiteSpace(queryData.Keyword))
                {
                    if (queryData.KeywordFields.Count == 0 || queryData.KeywordFields.Contains(BorrowingRecordKeywordOption.All))
                    {
                        results = (from b in results
                                   where ((b.User.FirstName + " " + b.User.LastName).ToLower().Contains(queryData.Keyword.ToLower())) ||
                                   b.User.Email.ToLower().Contains(queryData.Keyword.ToLower()) ||
                                   b.Book.Name.ToLower().Contains(queryData.Keyword.ToLower()) ||
                                   b.Book.Author.ToLower().Contains(queryData.Keyword.ToLower()) ||
                                   b.Book.ISBN.ToLower().Contains(queryData.Keyword.ToLower()) ||
                                   b.Book.Owner.ToLower().Contains(queryData.Keyword.ToLower())
                                   select b);
                    }
                    else
                    {
                        if (queryData.KeywordFields.Contains(BorrowingRecordKeywordOption.UserName))
                        {
                            results = (from b in results
                                       where ((b.User.FirstName + " " + b.User.LastName).ToLower().Contains(queryData.Keyword.ToLower()))
                                       select b);
                        }

                        if (queryData.KeywordFields.Contains(BorrowingRecordKeywordOption.UserEmail))
                        {
                            results = (from b in results
                                       where b.User.Email.ToLower().Contains(queryData.Keyword.ToLower())
                                       select b);
                        }

                        if (queryData.KeywordFields.Contains(BorrowingRecordKeywordOption.BookTitle))
                        {
                            results = (from b in results
                                       where b.Book.Name.ToLower().Contains(queryData.Keyword.ToLower())
                                       select b);
                        }

                        if (queryData.KeywordFields.Contains(BorrowingRecordKeywordOption.BookAuthor))
                        {
                            results = (from b in results
                                       where b.Book.Author.ToLower().Contains(queryData.Keyword.ToLower())
                                       select b);
                        }

                        if (queryData.KeywordFields.Contains(BorrowingRecordKeywordOption.ISBN))
                        {
                            results = (from b in results
                                       where b.Book.ISBN.ToLower().Contains(queryData.Keyword.ToLower())
                                       select b);
                        }

                        if (queryData.KeywordFields.Contains(BorrowingRecordKeywordOption.BookOwner))
                        {
                            results = (from b in results
                                       where b.Book.Owner.ToLower().Contains(queryData.Keyword.ToLower())
                                       select b);
                        }
                    }
                }
            }

            // Bootstrap table need to return queried rows and also the total count for paging purpose
            return new
            {
                total = results.Count(),
                rows = (from b in results select b)
                .OrderBy(b => b.EndDate)
                .Skip<Borrow>((int)(parameters.offset))
                .Take((int)(parameters.limit)).ToArray()
            };
        }

        [HttpPost]
        [Route("records/individual", Name = "GetIndividualLoanHistory")]
        public object GetIndividualLoanHistory(dynamic parameters)
        {

            //string userId, DateTime startDate, DateTime endDate, List<BorrowingRecordDateQueryOption> dateQueryOptions, int offset, int limit
            IndividualBorrowingRecordQueryDTO queryData = Newtonsoft.Json.JsonConvert.DeserializeObject<IndividualBorrowingRecordQueryDTO>(Convert.ToString(parameters.customQueryParameters));
            IQueryable<Borrow> results; 
            if (queryData.UserId != null)
            {
                // By specifying the end date year not equals to 1970, make sure it's returned book.
                results= db.Borrows.Where(b => b.EndDate.Year != 1970 && b.UserId == queryData.UserId).Include("Book");
                queryData.EndDate = queryData.EndDate.AddDays(1);
                if (queryData.DateQueryOptions.Count == 0 || queryData.DateQueryOptions.Count > 1)
                {
                    results = (from b in results
                               where b.EndDate.Year != 1970
                               && b.StartDate >= queryData.StartDate && b.StartDate < queryData.EndDate
                               && b.EndDate >= queryData.StartDate && b.EndDate < queryData.EndDate
                               select b);
                }
                else
                {
                    switch (queryData.DateQueryOptions[0])
                    {
                        case BorrowingRecordDateQueryOption.BorrowedDate:
                            results = (from b in results
                                       where b.EndDate.Year != 1970
                                       && b.StartDate >= queryData.StartDate && b.StartDate < queryData.EndDate
                                       select b);
                            break;
                        case BorrowingRecordDateQueryOption.ReturnedDate:
                            results = (from b in results
                                       where b.EndDate.Year != 1970
                                       && b.EndDate >= queryData.StartDate && b.EndDate < queryData.EndDate
                                       select b);
                            break;
                    }
                }

                return new
                {
                    total = results.Count(),
                    rows = (from b in results select b)
                            .OrderBy(b => b.EndDate)
                            .Skip<Borrow>((int)(parameters.offset))
                            .Take((int)(parameters.limit)).ToArray()
                            };
            }

            return new
            {
                total = 0,
                rows = new Borrow[] { }
            };
        }

        // GET: api/borrows/5
        [ResponseType(typeof(Borrow))]
        [Authorize(Roles = "Admin")]
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

        [HttpGet]
        [Route("user/{userId}", Name = "GetBorrowsByUserId")]
        // The parameter name "userId" must be the same as the parameter name in the following action
        public IList<Borrow> GetBorrowsByUserId(string userId)
        {
            IEnumerable<Borrow> borrows = from b in db.Borrows.Include("Book")
                                          where b.UserId == userId
                                          select b;
            if (borrows == null || borrows.Count() == 0)
            {
                return null;
            }

            return borrows.ToList<Borrow>();
        }

        [HttpGet]
        [Route("user/{userId}/notReturned", Name = "GetNotReturnedBorrowsByUserId")]
        // The parameter name "userId" must be the same as the parameter name in the following action
        public IList<Borrow> GetNotReturnedBorrowsByUserId(string userId)
        {
            IEnumerable<Borrow> borrows = from b in db.Borrows.Include("Book")
                                          where b.UserId == userId && b.EndDate.Year == 1970
                                          select b;
            if (borrows == null || borrows.Count() == 0)
            {
                return null;
            }

            return borrows.ToList<Borrow>();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("book/{bookId}", Name = "GetBorrowsByBookId")]
        // The parameter name "bookId" must be the same as the parameter name in the following action
        public IList<Borrow> GetBorrowsByBookId(Guid bookId)
        {
            IEnumerable<Borrow> borrows = from b in db.Borrows
                                          where b.BookId == bookId
                                          select b;
            if (borrows == null || borrows.Count() == 0)
            {
                return null;
            }

            return borrows.ToList<Borrow>();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("book/{bookId}/notReturned", Name = "GetNotReturnedBorrowsByBookId")]
        // The parameter name "bookId" must be the same as the parameter name in the following action
        public IList<Borrow> GetNotReturnedBorrowsByBookId(Guid bookId)
        {
            IEnumerable<Borrow> borrows = from b in db.Borrows
                                          where b.BookId == bookId && b.EndDate.Year == 1970
                                          select b;
            if (borrows == null || borrows.Count() == 0)
            {
                return null;
            }

            return borrows.ToList<Borrow>();
        }

        // PUT: api/borrows/5
        [ResponseType(typeof(void))]
        [Route("{id:guid}")]
        [Authorize(Roles = "Admin")]
        //public async Task<IHttpActionResult> PutBorrow(Guid id, Borrow borrow)
        public IHttpActionResult PutBorrow(Guid id, Borrow borrow)
        {
            lock (thisLock)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != borrow.BorrowId)
                {
                    return BadRequest();
                }

                using (System.Transactions.TransactionScope ts = new System.Transactions.TransactionScope())
                {
                    db.Entry(borrow).State = EntityState.Modified;
                    try
                    {
                        // 处理并发的问题
                        // 多个请求同时修改同一个user的BorrowedBooksCount(批量还书的情况下）
                        // 如果不作并发处理，这样会导致BorrowedBooksCount的值只被减了1，尽管应该减去所还书的数量。原因可能在于：
                        // 第一次取出这个user，在更新到数据库之前，第二，三次的request已经到了服务端，并也取出了user。这样，每个request中的user的BorrowedBooksCount都是3（假设这个user借了3本书），
                        // 那么虽然三次request中都完成了更新，但所完成的更新却都是3 - 1，所以最后导致好像只更新了一次似的。

                        // 参考
                        // Entity Framework并发处理详解：   http://www.cnblogs.com/leslies2/archive/2012/07/30/2608784.html


                        // Cannot await in the body of a lock statement.
                        //ApplicationUser user = await ((DbSet<ApplicationUser>)db.Users).FindAsync(borrow.UserId);
                        ApplicationUser user = ((DbSet<ApplicationUser>)db.Users).Find(borrow.UserId);
                        if (user != null)
                        {
                            if (user.BorrowedBooksCount > 0)
                            {
                                user.BorrowedBooksCount -= 1; ;
                            }
                        }
                        else
                        {
                            throw new Exception("user id is " + borrow.UserId + ", but not found user by it. and book id is " + borrow.BookId + ".");
                        }

                        // Cannot await in the body of a lock statement.
                        //Book book = await db.Books.FindAsync(borrow.BookId);
                        using (ApplicationDbContext newDb = ApplicationDbContext.Create())
                        {
                            // 这里必须重新使用一个dbContext， 我也不知道为什么。否则会认为数据没有更新，会导致两个问题：
                            // 1. 书的available copies没有更新，数据错误/丢失。
                            // 2. 由于认为数据没有更新，如果user借了两本相同的书，那么系统会认为第二次取出并尝试更新的就是上次取出的，并且有更改的，但尚未保存的同一条记录。
                            //    从而导致DbUpdateConcurrencyExceiption, 见catch语句中。
                            Book book = newDb.Books.Find(borrow.BookId);
                            if (book != null)
                            {
                                if (book.AvailableCopies < book.Copies)
                                {
                                    book.AvailableCopies += 1;
                                    newDb.SaveChanges();
                                }
                            }
                            else
                            {
                                throw new Exception("borrow id is " + borrow.BookId + ", but not found book by it. and user id is " + borrow.UserId + ".");
                            }
                        }

                        // Cannot await in the body of a lock statement.
                        //await db.SaveChangesAsync();
                        db.SaveChanges();
                        ts.Complete();
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
                }

                return Ok(borrow);
            }
        }

        // POST: api/borrows
        [ResponseType(typeof(Borrow))]
        [Route("")]
        [Authorize(Roles = "Admin")]
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
                    BookId = bookId,
                    StartDate = DateTime.Now,
                    EndDate = new DateTime(1970, 1, 1)
                    // Do Not set it as null since we take it as non-nullable (Entity Model and Database) in this applicaiton,
                    // because it's harder to handle if allow it to be null, refer to:
                    // https://stackoverflow.com/questions/25623542/nullable-datetime-property-in-entity-framework-6-thows-exception-on-save-when-va
                    // https://stackoverflow.com/questions/26568488/how-to-insert-null-datetime-in-database-with-entity-framework-codefirst
                    // So, we set it as the oldest value that JavaScript can recogonize, which is 1/1/1970.
                };

                db.Borrows.Add(newBorrow);
                borrows.Add(newBorrow);

                var book = db.Books.Find(bookId);
                if (book != null)
                {
                    book.AvailableCopies--;
                }
                else
                {
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
        [Route("{id:guid}", Name = "DeleteBorrow")]
        [Authorize(Roles = "Admin")]
        public async Task<IHttpActionResult> DeleteBorrow(Guid id)
        {
            Borrow borrow = await db.Borrows.FindAsync(id);
            if (borrow == null)
            {
                return NotFound();
            }

            //能获取borrow, borrow里面的UserId却是null. 不知道原因在哪里。
            // 从并发和EF外建去investigate了一下。没有结果      
            //if (borrow.UserId == null)
            //{
            //    throw new Exception("user id is " + borrow.UserId + ", but not found user by it. and book id is " + borrow.BookId + ".");
            //}

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