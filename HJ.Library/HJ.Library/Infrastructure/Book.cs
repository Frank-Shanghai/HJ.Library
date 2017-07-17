using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

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

        public int AvailableCopies { get; set; }

        public string Owner { get; set; }

        public string Comment { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }

        // Refer to the following link about why to add JsonIgnore attribute
        // https://stackoverflow.com/questions/5769200/serialize-one-to-many-relationships-in-json-net
        [JsonIgnore]
        public virtual ICollection<Borrow> BeBorrowedRecords { get; set; }
    }
}