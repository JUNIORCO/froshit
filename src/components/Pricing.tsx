import { Button, Card, Divider, Stack, Typography } from '@mui/material';
import Iconify from './Iconify';
import documentVertical from '@iconify/icons-carbon/document-vertical';
import money from '@iconify/icons-carbon/money';
import applicationWeb from '@iconify/icons-carbon/application-web';
import applicationMobile from '@iconify/icons-carbon/application-mobile';
import { PATH_PAGE } from '../routes/paths';

const pricingPlan = {
  license: '$4.99 per user',
  commons: ['Registration', 'Payment', 'Admin Console', 'Mobile App'],
  options: [
    'Unlimited students',
    'Unlimited leaders',
    'Unlimited collaborators',
  ],
  icons: [
    documentVertical,
    money,
    applicationWeb,
    applicationMobile,
  ],
};

type PlanCardProps = {
  plan: {
    license: string;
    commons: string[];
    options: string[];
    icons: any[];
  };
};

export function PlanCard() {
  const { license, commons, options, icons } = pricingPlan;

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: (theme) => theme.customShadows.z24,
      }}
    >
      <Stack spacing={5}>
        <div>
          <Typography variant='h4'>{license}</Typography>
        </div>

        <Stack direction="row" spacing={1.5}>
          {icons.map((icon, index) => (
            <Iconify key={index} icon={icon} sx={{ width: 32, height: 32 }}/>
          ))}
        </Stack>

        <Stack spacing={2.5}>
          {commons.map((option) => (
            <Stack key={option} spacing={1.5} direction='row' alignItems='center'>
              <Iconify
                icon={'eva:checkmark-fill'}
                sx={{ color: 'primary.main', width: 20, height: 20 }}
              />
              <Typography variant='body2'>{option}</Typography>
            </Stack>
          ))}

          <Divider sx={{ borderStyle: 'dashed' }} />

          {options.map((option, optionIndex) => {
            const disabledLine = optionIndex === 3;

            return (
              <Stack
                spacing={1.5}
                direction='row'
                alignItems='center'
                sx={{
                  ...(disabledLine && { color: 'text.disabled' }),
                }}
                key={option}
              >
                <Iconify
                  icon={'eva:checkmark-fill'}
                  sx={{
                    width: 20,
                    height: 20,
                    color: 'primary.main',
                    ...(disabledLine && { color: 'text.disabled' }),
                  }}
                />
                <Typography variant='body2'>{option}</Typography>
              </Stack>
            );
          })}
        </Stack>

        <Button
          size='large'
          fullWidth
          variant={'contained'}
          href={PATH_PAGE.contact}
        >
          Get started
        </Button>
      </Stack>
    </Card>
  );
}
