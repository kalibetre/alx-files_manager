import { getCurrentUser } from '../utils/auth';
import File from '../utils/file';

/**
 * FilesController class to manage user files
 */
class FilesController {
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
      const file = new File(currentUser.id, name, type, parentId, isPublic, data);
      const savedFile = await file.save();
      return response.status(201).json(savedFile);
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }
}

export default FilesController;
