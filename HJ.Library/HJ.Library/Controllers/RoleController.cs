﻿using HJ.Library.Infrastructure;
using HJ.Library.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace HJ.Library.Controllers
{
    [Authorize(Roles="Admin")]
    [RoutePrefix("api/roles")]
    public class RoleController: BaseApiController
    {
        [Route("{id:guid}", Name="GetRoleById")]
        public async Task<IHttpActionResult> GetRole( string id )
        {
            var role = await this.AppRoleManager.FindByIdAsync( id );

            if ( role != null )
            {
                return Ok( TheModelFactory.Create( role ) );
            }

            return NotFound();
        }

        [Route("", Name="GetAllRoles")]//name 是路由名称，可以用asp.net razor语法在页面中生成url，如@Url.RouteUrl("GetAllRoles"). 在这个project中客户端用不到，
        //但在服务器端有用到， 见ModelFactory.cs, 如： Url = this.urlHelper.Link( "GetRoleById", new { id = appRole.Id } )
        public IHttpActionResult GetAllRoles()
        {
            var roles = this.AppRoleManager.Roles;
            return Ok( roles );
        }

        [Route("create")]
        public async Task<IHttpActionResult> Create( RoleDto model )
        {
            if ( !ModelState.IsValid )
            {
                return BadRequest( ModelState );
            }

            var role = new IdentityRole { Name = model.Name };
            var result = await this.AppRoleManager.CreateAsync( role );

            if ( !result.Succeeded )
            {
                return GetErrorResult( result );
            }

            Uri locationHeader = new Uri( Url.Link( "GetRoleById", new { id = role.Id } ) );
            return Created( locationHeader, TheModelFactory.Create( role ) );
        }

        [Route("{id:guid}")]
        public async Task<IHttpActionResult> DeleteRole( string id )
        {
            var role = await this.AppRoleManager.FindByIdAsync( id );
            if ( role != null )
            {
                IdentityResult result = await this.AppRoleManager.DeleteAsync( role );
                if ( !result.Succeeded )
                {
                    return GetErrorResult( result );
                }

                return Ok();
            }

            return NotFound();
        }

        [Route("ManageUsersInRole")]
        public async Task<IHttpActionResult> ManageUsersInRole( UsersInRoleModel model )
        { 
            var role = await this.AppRoleManager.FindByIdAsync(model.Id);
            if ( role == null )
            {
                ModelState.AddModelError( "", "Role does not exist" );
                return BadRequest( ModelState );
            }

            foreach ( string user in model.EnrolledUsers )
            {
                var appUser = await this.AppUserManager.FindByIdAsync( user );
                if ( appUser == null )
                {
                    ModelState.AddModelError( "", string.Format( "User: {0} does not exists", user ) );
                    continue;
                }

                if ( !this.AppUserManager.IsInRole( user, role.Name ) )
                {
                    IdentityResult result = await this.AppUserManager.AddToRoleAsync( user, role.Name );

                    if ( !result.Succeeded )
                    {
                        ModelState.AddModelError( "", string.Format( "User: {0} could not be added to role", user ) );
                    }
                }                
            }

            foreach ( string user in model.RemovedUsers )
            {
                var appUser = await this.AppUserManager.FindByIdAsync( user );
                if ( appUser == null )
                {
                    ModelState.AddModelError( "", string.Format( "User: {0} does not exist", user ) );
                    continue;
                }

                IdentityResult result = await this.AppUserManager.RemoveFromRoleAsync( user, role.Name );
                if ( !result.Succeeded )
                {
                    ModelState.AddModelError( "", string.Format( "User: {0} could not be removed from role", user ) );
                }
            }

            if ( !ModelState.IsValid )
            {
                return BadRequest( ModelState );
            }

            return Ok();
        }
    }
}