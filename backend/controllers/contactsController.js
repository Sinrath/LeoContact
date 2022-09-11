const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');

// @desc Get all contacts 
// @route GET /contacts
// @access Private
const getAllContacts = asyncHandler(async (req, res) => {
    // Get all contacts from MongoDB
    const contacts = await Contact.find().lean();

    // If no contacts 
    if (!contacts?.length) {
        return res.status(400).json({message: 'No contacts found'});
    }

    res.json(contacts);
});

// @desc Create new contact
// @route POST /contacts
// @access Private
const createNewContact = asyncHandler(async (req, res) => {
    const {firstname, lastname, email} = req.body;


    // Check for duplicate email
    const duplicate = await Contact.findOne({email}).lean().exec();

    if (duplicate) {
        return res.status(409).json({message: 'Duplicate contact Email!'});
    }

    // Create and store the new contact
    const contact = await Contact.create({firstname, lastname, email});

    if (contact) { // Created 
        return res.status(201).json({message: 'New contact created'});
    } else {
        return res.status(400).json({message: 'Invalid contact data received'});
    }

});

// @desc Update a contact
// @route PATCH /contacts
// @access Private
const updateContact = asyncHandler(async (req, res) => {
    const {id, firstname, lastname, email} = req.body;

    // Confirm contact exists to update
    const contact = await Contact.findById(id).exec();

    if (!contact) {
        return res.status(400).json({message: 'Contact not found'});
    }

    // Check for duplicate email
    const duplicate = await Contact.findOne({email}).lean().exec();

    // Allow renaming of the original contact 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate contact email'});
    }

    contact.firstname = firstname;
    contact.lastname = lastname;
    contact.email = email;
    // contact.address = address;

    const updatedContact = await contact.save();

    res.json(`'${updatedContact.email}' updated`);
});

// @desc Delete a contact
// @route DELETE /contacts
// @access Private
const deleteContact = asyncHandler(async (req, res) => {
    const {id} = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({message: 'Contact ID required'});
    }

    // Confirm contact exists to delete 
    const contact = await Contact.findById(id).exec();

    if (!contact) {
        return res.status(400).json({message: 'Contact not found'});
    }

    const result = await contact.deleteOne();

    const reply = `Contact '${result.email}' with ID ${result._id} deleted`;

    res.json(reply);
});

module.exports = {
    getAllContacts,
    createNewContact,
    updateContact,
    deleteContact
};