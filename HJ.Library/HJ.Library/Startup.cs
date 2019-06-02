using HJ.Library.Infrastructure;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using Owin;
using System;
using System.Configuration;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;

namespace HJ.Library
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration httpConfig = new HttpConfiguration();
            ConfigureOAuthTokenGeneration(app);
            ConfigureOAuthTokenConsumption( app );
            ConfigureWebApi(httpConfig);
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(httpConfig);
        }

        private void ConfigureOAuthTokenGeneration(IAppBuilder app)
        { 
            // Configure the db context and user manager to use a sinle instance per request
            app.CreatePerOwinContext<ApplicationDbContext>(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationRoleManager>( ApplicationRoleManager.Create );

            // Plugin the OAuth bearer JSON Web Token tokens generation and Consumption will be here
            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                // for dev environment only (on production should be AllowInsecureHttp = false)
                AllowInsecureHttp = true,
                TokenEndpointPath = new Microsoft.Owin.PathString( "/oauth/token" ),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays( 1 ),
                Provider = new Providers.CustomOAuthProvider(),
                // check the port number in project property -> Web tab page
                AccessTokenFormat = new Providers.CustomJwtFormat( "http://localhost:8010/" )
            };

            // OAuth 2.0 Bearer Access Token generation
            app.UseOAuthAuthorizationServer( OAuthServerOptions );
        }

        private void ConfigureOAuthTokenConsumption( IAppBuilder app )
        {
            //var issuer = "http://localhost:59845/";
            var issuer = "http://localhost:8010/";
            string audienceId = ConfigurationManager.AppSettings[ "as:AudienceId" ];
            byte[] audienceSecret = TextEncodings.Base64Url.Decode( ConfigurationManager.AppSettings[ "as:AudienceSecret" ] );

            // Api controllers with an [Authorize] attribute will be validated with JWT
            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    AllowedAudiences = new[] { audienceId },
                    IssuerSecurityTokenProviders = new IIssuerSecurityTokenProvider[]
                    {
                        new SymmetricKeyIssuerSecurityTokenProvider(issuer, audienceSecret)
                    }
                }
                );
        }

        private void ConfigureWebApi(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Book>("BooksOData");
            builder.EntitySet<Borrow>("BorrowsOData");
            builder.EntitySet<ApplicationUser>("UsersOData");
            config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());

            // Specify time zone, or the formatter will use the GMT time zone
            config.Formatters.JsonFormatter.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Local;

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}