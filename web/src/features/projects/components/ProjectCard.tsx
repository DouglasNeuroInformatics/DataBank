import { $ProjectInfo } from '@databank/core';
import { Badge, Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';

export const ProjectCard = ({
  createdAt,
  description,
  expiry,
  externalId,
  id,
  isProjectManager,
  name,
  updatedAt,
  userIds
}: $ProjectInfo) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <Card.Title>{name}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </Card.Header>
        <Card.Content>
          <ul>
            <li>
              {t('projectId')}: {id}
            </li>
            <li>
              {t('projectExternalId')}: {externalId}
            </li>
            <li>
              {t('createdAt')}: {createdAt.toString()}
            </li>
            <li>
              {t('updatedAt')}: {updatedAt.toString()}
            </li>
            <li>
              {t('projectExpiry')}: {expiry.toString()}
            </li>
            <li>
              {t('userId')}:{' '}
              {userIds.map((element) => {
                return (
                  <Badge key={`UserId-${element}`} variant={'secondary'}>
                    {element}
                  </Badge>
                );
              })}
            </li>
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between">
          {isProjectManager ? (
            <Button variant={'primary'} onClick={() => void navigate({ to: `/portal/projects/${id}` })}>
              {t('manageProject')}
            </Button>
          ) : (
            <Button variant={'primary'} onClick={() => void navigate({ to: `/portal/projects/${id}` })}>
              {t('viewProject')}
            </Button>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};
