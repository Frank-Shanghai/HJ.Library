using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HJ.Library.Models
{    public enum BooksQueryOption
    {
        All = 0,
        Title = 1,
        Author = 2,
        ISBN = 3,
        Publisher = 4
    }

    public class BooksQueryDTO
    {
        public string Keyword { get; set; }
        public List<BooksQueryOption> QueryOptions { get; set; }
    }
}