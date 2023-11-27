migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a3gigkdutagwaj4")

  collection.listRule = "@request.auth.game = game || @request.auth.id = game.raditajs.id"
  collection.viewRule = "@request.auth.game = game || @request.auth.id = game.raditajs.id"
  collection.createRule = "@request.auth.game = game || @request.auth.id = game.raditajs.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("a3gigkdutagwaj4")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
