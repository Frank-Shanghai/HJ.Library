using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HJ.Library.Models
{
    public enum KeywordOption
    {
        All = 0,
        UserName = 1,
        UserEmail = 2,
        BookTitle = 3,
        BookAuthor = 4,
        ISBN = 5,
        BookOwner = 6
    }

    public enum DateQueryOption
    {
        All = 0,
        BorrowedDate = 1,
        ReturnedDate = 2
    }

    public class BorrowingRecordQueryDTO
    {
        public string Keyword { get; set; }
        public List<KeywordOption> KeywordFields { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<DateQueryOption> DateQueryOptions { get; set; }

        public BorrowingRecordQueryDTO()
        {
            this.Keyword = "";
            this.KeywordFields = new List<KeywordOption>();
            this.EndDate = DateTime.Now;
            this.StartDate = DateTime.Now.AddDays(-28);// Update this value if user borrow maximum time span changed, keep consistence with client side
            this.DateQueryOptions = new List<DateQueryOption>();
        }
    }
}