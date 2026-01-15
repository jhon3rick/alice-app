/**
 * TagList
 *
 * View component for listing and managing tags.
 * Displays tags in a table with add, edit, and delete functionality.
 */

import React, { useEffect, useState } from 'react';

// Store
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchTags, addTag, modifyTag, removeTag } from '@store/tagsSlice';

// Custom Components
import ModalNewTag from '@components/ModalNewTag';
import RenderDevIcon from '@ui/RenderDevIcon';
import ViewContainer from '@ui/ViewContainer';
import DataTable, { GridColDef } from '@ui/DataTable';
import { IActionButton } from '@ui/ActionsToolbar';

// Types
import { StoredTag } from '@tstypes/dbmodules';

import './TagList.scss';

const columnsSchema: GridColDef[] = [
  {
    flex: 1,
    field: 'icon',
    headerName: '',
    minWidth: 40,
    maxWidth: 40,
    display: 'flex',
    renderCell: (params) => <RenderDevIcon iconName={params.value as string} />,
  },
  {
    flex: 1,
    field: 'codeindex',
    headerName: 'Code Index',
    minWidth: 100,
    maxWidth: 200,
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

  const handleSave = async (formData: { name: string; codeindex: string; icon?: string }) => {
    if (editingTag) {
      await dispatch(
        modifyTag({
          id: editingTag.id,
          name: formData.name,
          icon: formData.icon,
          codeindex: formData.codeindex,
        })
      );
    } else {
      await dispatch(
        addTag({
          name: formData.name,
          icon: formData.icon,
          codeindex: formData.codeindex,
        })
      );
    }

    handleCloseDialog();
  };

  const handleDelete = async (tag: StoredTag) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      await dispatch(removeTag(tag.id));
    }
  };

  const actionsToolbar: IActionButton[] = [
    {
      iconName: 'add',
      tooltip: 'Add Tag',
      onClick: () => handleOpenDialog(),
    },
  ];

  return (
    <ViewContainer title="tags" actions={actionsToolbar}>
      <DataTable
        rows={tags}
        columns={columnsSchema}
        pageSize={25}
        onEditRow={handleOpenDialog}
        onDeleteRow={handleDelete}
        pageSizeOptions={[5, 10, 25, 50]}
        filterByFields={['name', 'codeindex']}
      />
      <ModalNewTag open={dialogOpen} editingTag={editingTag} onClose={handleCloseDialog} onSave={handleSave} />
    </ViewContainer>
  );
};

export default TagList;
