import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import ViewContainer from '@ui/ViewContainer';
import ModalNewTag from '@components/ModalNewTag';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchTags, addTag, modifyTag, removeTag } from '@store/tagsSlice';
import { Tag } from '@types/index';
import './TagList.scss';

const TagList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { tags } = useAppSelector((state) => state.tags);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleOpenDialog = (tag?: Tag) => {
    setEditingTag(tag || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTag(null);
  };

  const handleSave = async (formData: { name: string; codeindex?: string }) => {
    if (editingTag) {
      await dispatch(
        modifyTag({
          id: editingTag.id!,
          name: formData.name,
          codeindex: formData.codeindex,
        })
      );
    } else {
      await dispatch(
        addTag({
          name: formData.name,
          codeindex: formData.codeindex,
        })
      );
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      await dispatch(removeTag(id));
    }
  };

  return (
    <ViewContainer
      title="tags"
      actions={
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Tag
        </Button>
      }
    >
      <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code Index</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography color="text.secondary">No tags found. Add one to get started.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell>{tag.codeindex || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(tag)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(tag.id!)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

      <ModalNewTag
        open={dialogOpen}
        editingTag={editingTag}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </ViewContainer>
  );
};

export default TagList;
