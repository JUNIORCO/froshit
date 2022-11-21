import { Stack, Button, Typography } from '@mui/material';
import useLocales from '../../../hooks/useLocales';
import { PATH_DOCS } from '../../../routes/paths';

export default function NavbarDocs() {
  const { translate } = useLocales();

  return (
    <Stack
      spacing={3}
      sx={{ px: 5, pb: 5, mt: 3, width: 1, textAlign: 'center', display: 'block' }}
    >
      {/*<DocIllustration sx={{ width: 1 }} />*/}

      <div>
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {translate('docs.description')}
        </Typography>
      </div>

      <Button href={PATH_DOCS} target="_blank" rel="noopener" variant="contained">
        {translate('docs.documentation')}
      </Button>
    </Stack>
  );
}
