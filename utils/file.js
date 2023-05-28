import { mkdir, writeFile } from 'fs/promises';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import dBClient from './db';

const FOLDER = 'folder';
const FILE = 'file';
const IMAGE = 'image';
const VALID_FILE_TYPES = [FOLDER, FILE, IMAGE];
const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesCollection {
  constructor() {
    this.files = dBClient.filesCollection();
  }

  async findById(id) {
    return this.files.findOne({ _id: ObjectId(id) });
  }

  async addFile(file) {
    const result = await this.files.insertOne(file);
    const { _id, ...rest } = result.ops[0];
    return { id: _id, ...rest };
  }
}
