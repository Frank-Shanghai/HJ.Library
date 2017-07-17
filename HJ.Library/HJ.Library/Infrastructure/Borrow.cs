﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HJ.Library.Infrastructure
{
    public class Borrow
    {
        [Key]
        public Guid BorrowId { get; set; }

        public Guid BookId { get; set; }

        public string UserId { get; set; } 

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }

        public virtual Book Book { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}