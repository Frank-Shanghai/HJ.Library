using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace HJ.Library.Infrastructure
{
    public class ApplicationDbContext: IdentityDbContext<ApplicationUser>
    {
        public DbSet<Book> Books { get; set; }

        public ApplicationDbContext(): base("DefaultConnection", throwIfV1Schema: false)
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}