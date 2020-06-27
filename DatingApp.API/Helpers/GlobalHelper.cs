using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Helpers
{
    public static class GlobalHelper
    {
        public static bool IsThisUserAuthorized(int userId, ClaimsPrincipal user) => userId == int.Parse(user.FindFirst(ClaimTypes.NameIdentifier).Value);
    }
}