migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

		collection.viewRule = "@request.auth.id = raditajs.id || @request.auth.game.id = id"

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

		collection.viewRule = null

		return dao.saveCollection(collection)
	}
)
