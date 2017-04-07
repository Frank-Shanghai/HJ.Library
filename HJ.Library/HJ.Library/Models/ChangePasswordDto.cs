using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HJ.Library.Models
{
    public class ChangePasswordDto
    {
        [Required]
        [DataType( DataType.Password )]
        [Display( Name = "Current password" )]
        public string OldPassword { get; set; }

        [Required]
        [StringLength( 100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6 )]
        [DataType( DataType.Password )]
        [Display( Name = "New password" )]
        public string NewPassword { get; set; }
    }
}