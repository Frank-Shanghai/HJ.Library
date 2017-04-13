using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace HJ.Library.Infrastructure
{
    public class Book
    {
        [Key]
        public Guid BookId { get; set; }

        public string ISBN { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Author { get; set; }

        public string Publisher { get; set; }

        public DateTime PublicationDate { get; set; }

        public int Pages { get; set; }

        public int Copies { get; set; }

        public int Status { get; set; }

        public string Owner { get; set; }

        public string Comment { get; set; }

    }
}