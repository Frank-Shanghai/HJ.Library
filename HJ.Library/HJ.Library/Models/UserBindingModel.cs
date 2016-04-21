using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HJ.Library.Models
{
    public class UserBindingModel
    {
        [Required]
        [EmailAddress]        
        public string Email { get; set; }

        [Required]
        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string RoleName { get; set; }

        public string Password { get; set; }
    }
}