migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

		collection.viewRule = "@request.auth.game.id = game.id"

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

		collection.viewRule = null

		return dao.saveCollection(collection)
	}
)
