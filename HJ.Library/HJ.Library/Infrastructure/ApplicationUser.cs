using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Security.Claims;

namespace HJ.Library.Infrastructure
{
    public class ApplicationUser: IdentityUser
    {
        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string LastName { get; set; }

        public int BorrowedBooks { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync( UserManager<ApplicationUser> manager, string authenticationtype )
        {
            var userIdentity = await manager.CreateIdentityAsync( this, authenticationtype );
            // Add custom user claims here
            return userIdentity;
        }
    }
}