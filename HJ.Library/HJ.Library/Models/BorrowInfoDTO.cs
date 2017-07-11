using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HJ.Library.Models
{
    public class BorrowInfoDTO
    {
        public string UserId { get; set; }
        public Guid[] Books { get; set; }
    }
}