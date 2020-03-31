const NotesService = {
    getallFolders(knex) {
        return knex.select(' * ').from('notes')
    },
    insertFolder(knex, newFolder) {
        return knex
        .insert(newFolder)
        .into('notes')
        .returning(' * ')
        .then(rows => {
            return rows[0]
        })
    },
    getById(knex, id) {
        return knex
            .from('notes')
            .select(' * ')
            .where('id', id)
            .first()
    },
    deleteFolder(knex,id) {
        return knex('notes')
        .where({ id })
        .delete()
    },
    updateFolder(knex, id, newFolderFields) {
        return knex('notes')
        .where({ id })
        .update(newFolderFields)
    }
}

module.exports = NotesService