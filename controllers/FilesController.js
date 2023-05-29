import { getCurrentUser } from '../utils/auth';
import File, { FilesCollection } from '../utils/file';

/**
 * FilesController class to manage user files
 */
class FilesController {
  /**
   * Handles uploading a file by creating a new File object and saving it to
   * the database.
   *
   * @param {Object} request - The HTTP request object.
   * @param {Object} response - The HTTP response object.
   * @return {Object} The saved file as a JSON object, or an error message as a
   * JSON object.
   */
  static async postUpload(request, response) {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return response.status(401).json({
        error: 'Unauthorized',
      });
    }

    const {
      name, type, parentId, isPublic, data,
    } = request.body;

    try {
      const file = new File(
        currentUser.id, name, type, parentId, isPublic, data,
      );
      const savedFile = await file.save();
      return response.status(201).json(savedFile);
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  /**
   * Returns a JSON response containing a file with the given id, if it belongs
   * to the current user.
   *
   * @param {Object} request - the HTTP request object
   * @param {Object} response - the HTTP response object
   * @return {Promise<Object>} - a JSON response containing the file, or an
   * error message
   */
  static async getShow(request, response) {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return response.status(401).json({
        error: 'Unauthorized',
      });
    }

    const { id } = request.params;
    const filesCollection = new FilesCollection();
    const file = await filesCollection.findUserFileById(currentUser.id, id);
    if (!file) {
      return response.status(404).json({
        error: 'Not found',
      });
    }

    return response.status(200).json(file);
  }

  /**
   * Retrieves a list of files belonging to the current user, filtered by
   * `parentId` and `page`.
   *
   * @param {Object} request - The request object containing query parameters.
   * @param {Object} response - The response object to send the list of files.
   * @return {Object} The HTTP response object with status code 200 and a JSON
   * array of files.
   */
  static async getIndex(request, response) {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return response.status(401).json({
        error: 'Unauthorized',
      });
    }

    let { parentId, page } = request.query;
    parentId = parentId || 0;
    page = page || 0;

    const filesCollection = new FilesCollection();
    const files = await filesCollection.findAllUserFilesByParentId(
      currentUser.id,
      parentId,
      page,
    );

    return response.status(200).json(files);
  }
}

export default FilesController;
