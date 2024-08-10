package routes

import (
	scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"

	"github.com/adatechschool/projet-mobile-pari_damis/controllers"
	"github.com/adatechschool/projet-mobile-pari_damis/middleware"
	"github.com/gin-gonic/gin"
)

func Routes(route *gin.Engine) {

	racine := route.Group("/")
	racine.GET("/", func(c *gin.Context) {

		c.JSON(200, gin.H{
			"message": "message",
			// "ma requete": scheduler.Match(),
		})
	})

	auth := route.Group("/auth")
	auth.POST("/signUp", controllers.SignUp)
	auth.POST("/login", controllers.Login)

	user := route.Group("/user", middleware.RequireAuth)
	user.GET("/allUsers", controllers.AllUsers)
	user.GET("/oneUser/:UserID", controllers.OneUser)
	user.PUT("/updateUser/:UserID", controllers.UpdateUser)
	user.PUT("/updateAvatarOfUser/:UserID", controllers.UpdateAvatarOfUser)
	user.DELETE("/deleteOneUser/:UserID", controllers.DeleteOneUser)
	//relation groupe
	user.GET("/groupsOfOneUser/:UserID", controllers.ShowGroupsOfOneUser)
	//Token
	user.GET("/tokensOfOneUser/:UserID", controllers.ShowTokenOfUser)
	user.DELETE("/deleteOneTokenOfOneUser/:UserID/:AuthTokID", controllers.DeleteTokenOfUser)
	//route test middleware
	user.GET("/validate", middleware.RequireAuth, controllers.Validate)

	group := route.Group("/group", middleware.RequireAuth)
	group.POST("/createGroup/:userID", controllers.CreateGroup)
	group.PUT("/addUserToGroup/:GroupID/:UserID", controllers.AddUserToGroup)
	group.GET("/allGroups", controllers.AllGroups)
	group.PUT("/updateGroup/:GroupID", controllers.UpdateGroup)
	group.GET("/oneGroup/:GroupID", controllers.OneGroup)
	group.DELETE("/deleteOneGroup/:GroupID/:CreatorID", controllers.DeleteOneGroup)
	group.PUT("/addUserToGroupByCreatorId/:GroupID/:UserID/:CreatorID", controllers.AddUserToGroupByCreatorId)
	//relation User
	group.GET("/usersOfOneGroup/:GroupID", controllers.ShowUsersOfOneGroup)
	group.DELETE("/deleteUserOfGroupByCreatorId/:GroupID/:UserID/:CreatorID", controllers.DeleteUserOfGroupByCreatorId)

	bet := route.Group("/bet")

	bet.POST("/:UserID/:GroupID/:MatchID", controllers.CreateBet)
	bet.GET("betOfUser/:UserID", controllers.GetBetsByUserId)
	bet.GET("betOfGroup/:GroupID", controllers.GetBetsByGroupID)
	bet.GET("betOfUserByGroup/:GroupID/:UserID", controllers.GetBetsOfUserByGroupID)
	bet.GET("betOfUserByGroupOfThisWeek/:GroupID/:UserID/", controllers.GetBetsOfUserByGroupIDOfThisWeek)
	bet.PUT("/:BetID/:ResultOfBetID", controllers.UpdateBetWithResultOfBet)
	bet.GET("betOfUserByGroupByDate/:GroupID/:UserID/:DateOfMondayOfSearchWeek", controllers.GetBetsOfUserByGroupIDByDate)
	// format de la date pour le paramètre Date est 2024-06-17 ps mettre //

	resultofbet := route.Group("/resultofbet")
	resultofbet.POST("/:MatchID", controllers.CreateResultOfBet)
	resultofbet.GET("/:BetID", controllers.GetResultBetsByBetId)

	matchsofthewe := route.Group("/matchsofthewe")
	matchsofthewe.GET("/:GroupID/:UserID", scheduler.GetMatchesOfTheWeekEnd)
	matchsofthewe.GET("/whithoutFilter", scheduler.GetMatchesOfTheWeekEndWhithoutFilter)

}
