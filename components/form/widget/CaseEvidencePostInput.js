import { AttachFileOutlined, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import EvidencePostMetadata from 'classes/metadata/EvidencePostMetadata';

/**
 * A widget for input an evidence title and file, generate case post, upload it to IPFS, and get URI.
 */
export default function CaseEvidencePostInput(props) {
  const propsLabel = props.label;
  const propsSubLabel = props.options?.subLabel;
  const propsRequired = props.required;
  const propsDisabled = props.disabled;
  const propsOnChange = props.onChange;
  const { showToastError } = useToasts();
  const { uploadFileToIPFS, uploadJsonToIPFS } = useIpfs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadingToIpfs, setIsUploadingToIpfs] = useState(false);
  const [inputEvidenceTitle, setInputEvidenceTitle] = useState(null);
  const [inputEvidenceFile, setInputEvidenceFile] = useState(null);
  const [evidencePost, setEvidencePost] = useState(null);

  async function openDialog() {
    setIsDialogOpen(true);
  }

  async function closeDialog() {
    setIsDialogOpen(false);
    setInputEvidenceTitle(null);
    setInputEvidenceFile(null);
  }

  function changeTitle(event) {
    setInputEvidenceTitle(event.target.value);
  }

  async function dropFiles(acceptedFiles) {
    setInputEvidenceFile(acceptedFiles[0]);
  }

  async function addEvidence() {
    try {
      // Check file
      if (!isFileValid(inputEvidenceFile)) {
        throw new Error(
          'Only files with size smaller than 10MB are currently supported!',
        );
      }
      setIsUploadingToIpfs(true);
      // Upload evidence file to ipfs
      const { url: evidenceFileUri } = await uploadFileToIPFS(
        inputEvidenceFile,
      );
      // Upload evidence post to ipfs
      const evidencePost = new EvidencePostMetadata(
        inputEvidenceTitle,
        evidenceFileUri,
        inputEvidenceFile.name,
        inputEvidenceFile.type,
      );
      const { url: evidencePostUri } = await uploadJsonToIPFS(evidencePost);
      // Save post and post uri, close dialog
      setEvidencePost(evidencePost);
      propsOnChange(evidencePostUri);
      closeDialog();
    } catch (error) {
      showToastError(error);
    } finally {
      setIsUploadingToIpfs(false);
    }
  }

  function removeEvidence() {
    setEvidencePost(null);
    propsOnChange('');
  }

  function isFileValid(file) {
    if (!file) {
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      return false;
    }
    return true;
  }

  return (
    <>
      <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
      <Typography variant="body2">
        {propsSubLabel || 'Any file you deem necessary'} {propsRequired && '*'}
      </Typography>
      <Divider sx={{ mt: 1.5, mb: 2.5 }} />
      {evidencePost ? (
        <>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1}>
              <AttachFileOutlined />
              <Link
                href={evidencePost.evidenceFileUri}
                underline="none"
                target="_blank"
              >
                {evidencePost.evidenceTitle}
              </Link>
            </Stack>
          </Paper>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            disabled={propsDisabled}
            onClick={removeEvidence}
          >
            Remove
          </Button>
        </>
      ) : (
        <Button
          variant="outlined"
          disabled={propsDisabled}
          onClick={openDialog}
        >
          Add Evidence
        </Button>
      )}
      {/* Dialog for input title and file */}
      <Dialog
        open={isDialogOpen}
        onClose={isUploadingToIpfs ? null : closeDialog}
        fullWidth
      >
        <DialogTitle>Evidence</DialogTitle>
        <DialogContent>
          {/* Sublabel */}
          <Typography gutterBottom>{propsSubLabel}</Typography>
          <Divider sx={{ my: 1.5 }} />
          {/* Title */}
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
            onChange={changeTitle}
            disabled={isUploadingToIpfs}
          />
          {/* File */}
          <Box sx={{ mt: 2 }}>
            <Dropzone onDrop={dropFiles} disabled={isUploadingToIpfs}>
              {({ getRootProps, getInputProps }) => (
                <Paper
                  variant="outlined"
                  sx={{ cursor: isUploadingToIpfs ? null : 'pointer' }}
                >
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Stack alignItems="center" sx={{ p: 4 }} spacing={1}>
                      <AttachFileOutlined />
                      <Typography>
                        {inputEvidenceFile
                          ? inputEvidenceFile.name
                          : 'Drag & Drop Your File Here'}
                      </Typography>
                    </Stack>
                  </div>
                </Paper>
              )}
            </Dropzone>
          </Box>
          {/* Actions */}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {isUploadingToIpfs ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                Uploading to IPFS
              </LoadingButton>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={addEvidence}
                  disabled={!inputEvidenceTitle || !inputEvidenceFile}
                >
                  Add Evidence
                </Button>
                <Button variant="outlined" onClick={closeDialog}>
                  Close
                </Button>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
