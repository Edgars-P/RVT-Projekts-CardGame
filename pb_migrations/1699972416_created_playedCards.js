/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: "a3gigkdutagwaj4",
			created: "2023-11-14 14:33:36.383Z",
			updated: "2023-11-14 14:33:36.383Z",
			name: "playedCards",
			type: "base",
			system: false,
			schema: [
				{
					system: false,
					id: "44vfzosb",
					name: "player",
					type: "relation",
					required: false,
					presentable: false,
					unique: false,
					options: {
						collectionId: "0cocnj9515eu1ie",
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				},
				{
					system: false,
					id: "hkell9oh",
					name: "game",
					type: "relation",
					required: false,
					presentable: false,
					unique: false,
					options: {
						collectionId: "wtglq2y9rjye0wz",
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				},
				{
					system: false,
					id: "rwk0v8ku",
					name: "card",
					type: "relation",
					required: false,
					presentable: false,
					unique: false,
					options: {
						collectionId: "hb4j45w5czyx02n",
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				}
			],
			indexes: [],
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			options: {}
		})

		return Dao(db).saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId("a3gigkdutagwaj4")

		return dao.deleteCollection(collection)
	}
)
