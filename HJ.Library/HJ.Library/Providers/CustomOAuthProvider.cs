using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using System.Threading.Tasks;
using HJ.Library.Infrastructure;
using System.Security.Claims;

namespace HJ.Library.Providers
{
    public class CustomOAuthProvider: OAuthAuthorizationServerProvider
    {
        public override Task ValidateClientAuthentication( OAuthValidateClientAuthenticationContext context )
        {
            context.Validated();
            return Task.FromResult<object>( null );
        }

        public override async Task GrantResourceOwnerCredentials( OAuthGrantResourceOwnerCredentialsContext context )
        {
            var allowedOrigin = "*";
            context.OwinContext.Response.Headers.Add( "Access-Control-Allow-Origin", new[] { allowedOrigin } );
            var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();
            ApplicationUser user = await userManager.FindAsync( context.UserName, context.Password );

            if ( user == null )
            {
                context.SetError( "invalid_grant", "The user name or password is incorrect." );
            }

            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync( userManager, "JWT" );
            var ticket = new AuthenticationTicket( oAuthIdentity, null );
            context.Validated( ticket );
        }
    }
}