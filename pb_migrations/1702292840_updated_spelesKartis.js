migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

		collection.createRule = "@request.auth.id = karsuKomplekts.creator.id"

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

		collection.createRule = null

		return dao.saveCollection(collection)
	}
)
