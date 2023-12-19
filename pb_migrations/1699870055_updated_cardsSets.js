/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("jujjbq0fubmtwqr")

		collection.name = "cardSets"

		return dao.saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("jujjbq0fubmtwqr")

		collection.name = "cardsSets"

		return dao.saveCollection(collection)
	}
)
