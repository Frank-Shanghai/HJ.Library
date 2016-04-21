﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Routing;
using HJ.Library.Infrastructure;
using System.Net.Http;

namespace HJ.Library.Models
{
    public class ModelFactory
    {
        private UrlHelper urlHelper;
        private ApplicationUserManager appUserManager;

        public ModelFactory(HttpRequestMessage request, ApplicationUserManager appUserManager)
        {
            this.urlHelper = new UrlHelper(request);
            this.appUserManager = appUserManager;
        }

        public UserReturnModel Create(ApplicationUser appUser)
        {
            return new UserReturnModel
            {
                Url = this.urlHelper.Link("GetUserById", new { id = appUser.Id }),
                Id = appUser.Id,
                FirstName = appUser.FirstName,
                Lastname = appUser.LastName,
                UserName = appUser.UserName,
                Email = appUser.Email,
                EmailConfirmed = appUser.EmailConfirmed,
                Roles = appUserManager.GetRolesAsync(appUser.Id).Result,
                Claims = appUserManager.GetClaimsAsync(appUser.Id).Result
            };
        }
    }

    public class UserReturnModel
    {
        public string Url { get; set; }
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string Lastname { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public IList<string> Roles { get; set; }
        public IList<System.Security.Claims.Claim> Claims { get; set; }
    }
}