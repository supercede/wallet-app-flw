module.exports = {
  /**
   * @description handles paginating and filtering of results
   *
   * @param {Sequelize.Model} Model - Model to be queried
   * @param {Object} query - Query object
   * @param {Object} queryOptions - Query options such as filter, sort, etc.
   * @returns
   */
  paginate: async (Model, query, queryOptions) => {
    const { type, status, limit, page } = queryOptions;
    let { sort } = queryOptions;

    // Filter by transaction type
    if (type) {
      query.where.txn_type = type;
    }

    // Sort by ascending or descending order
    if (sort) {
      let order = 'ASC';

      if (sort.startsWith('-')) {
        order = 'DESC';
        sort = sort.substr(1);
      }

      // Filter by creation date if 'sort' is set to date
      if (sort === 'date') {
        query.order.push(['createdAt', order]);
      } else {
        query.order.push([sort, order]);
      }
    }

    query.limit = +limit;
    query.offset = +((page - 1) * limit);

    // Return count and Results
    const records = await Model.findAndCountAll(query);
    return records;
  },
};
