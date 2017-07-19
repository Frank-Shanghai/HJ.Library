using System;
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

        // Since string is reference type, so it can be null, when mapping to database, the column will be nullable.
        // To make as non-nullable, add the [Required] annotation here.
        [Required]
        public string UserId { get; set; } 

        public DateTime StartDate { get; set; }

        // DateTime is struct, which is value data type, so when mapping to the database, the column will be set non-nullable
        // So if want to make it as nullable, set the data type as "DateTime?".
        // But we will take it as non-nullable (Entity Model and Database) in this applicaiton,
        // because it's harder to handle if allow it to be null, refer to:
        // https://stackoverflow.com/questions/25623542/nullable-datetime-property-in-entity-framework-6-thows-exception-on-save-when-va
        // https://stackoverflow.com/questions/26568488/how-to-insert-null-datetime-in-database-with-entity-framework-codefirst
        public DateTime EndDate { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }

        public virtual Book Book { get; set; }

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
    }
}