/**
 * TagList
 *
 * View component for listing and managing tags.
 * Displays tags in a table with add, edit, and delete functionality.
 */

import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchTags, addTag, modifyTag, removeTag } from '@store/tagsSlice';

// Custom Components
import ModalNewTag from '@components/ModalNewTag';
import ViewContainer from '@ui/ViewContainer';
import DataTable, { GridColDef } from '@ui/DataTable';

// Types
import { StoredTag } from '@tstypes/dbmodules';

import './TagList.scss';

const columnsSchema: GridColDef[] = [
  {
    flex: 1,
    field: 'codeindex',
    headerName: 'Code Index',
    minWidth: 50,
    valueGetter: (value) => value || '-',
  },
  {
    flex: 1,
    field: 'name',
    headerName: 'Name',
    minWidth: 150,
  },
];

const TagList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { tags } = useAppSelector((state) => state.tags) as { tags: StoredTag[] };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<StoredTag | null>(null);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleOpenDialog = (tag?: StoredTag) => {
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
          id: editingTag.id,
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
      <DataTable
        rows={tags}
        columns={columnsSchema}
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onEditRow={handleOpenDialog}
        onDeleteRow={handleDelete}
      />
      <ModalNewTag open={dialogOpen} editingTag={editingTag} onClose={handleCloseDialog} onSave={handleSave} />
    </ViewContainer>
  );
};

export default TagList;
