const query_plates = async (query, schema) => {
    // const {page, limit, type, search} = query;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;
    let filter = {};
    let sort = {time: -1};
    const type = query.type
    const type_obj = { "type": type }
    const search_plate = { "plate_number": new RegExp(query.search, 'i') }
    if (query.search != null) {
        Object.assign(filter, search_plate)
    }
    if (type) {
        Object.assign(filter, type_obj)
    }
    if (query.sortBy) {
        const [sort_key, sort_value] = query.sortBy.split(':');
        sort = {[sort_key]: sort_value === 'desc' ? -1 : 1};
    };
    const plates = await schema.find(filter).limit(limit)
        .skip(skipIndex).sort(sort);
    const total_unknown = await schema.find({ "type": "unknown" }).countDocuments(search_plate);
    const total_known = await schema.find({ "type": "known" }).countDocuments(search_plate);
    const total_bad = await schema.find({ "type": "bad" }).countDocuments(search_plate);
    const total_plates = await schema.countDocuments(search_plate);
    if (type == "unknown"){
        total_items = total_unknown
    } else if (type == "known") {
        total_items = total_known
    } else if (type == "bad") {
        total_items = total_bad
    } else{
        total_items = total_plates
    }

    const results = { "total_page": Math.ceil(total_items/limit), "current_page": page, "total_plates": total_plates, 
    "total_unknown": total_unknown, "total_known": total_known, "total_bad": total_bad, "plates": plates, ...type_obj};
    // console.log(results)
    return results
}

module.exports = { query_plates };