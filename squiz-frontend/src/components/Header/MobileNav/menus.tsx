import { Box } from '@material-ui/core';
import { useLinguiI18n } from 'hooks/useLinguiI18n';
import { InteractionLocations } from 'lib/mparticle/enums';
import React from 'react';
import MobileLink from './link';
import { MenuContainer, Text } from './styled';

interface TProps {
  onClose: () => void;
}

const Menus: React.FC<TProps> = ({ onClose }) => {
  const i18n = useLinguiI18n();

  const MenuList = [
    {
      title: i18n._('Meditation'),
      link: '/',
      children: [
        {
          title: i18n._('All'),
          link: '/'
        },
        {
          title: i18n._('Playlists'),
          link: '/meditation-playlists'
        },
        {
          title: i18n._('Sleep'),
          link: '/meditation-topics/sleep'
        },
        {
          title: i18n._('Anxiety'),
          link: '/meditation-topics/anxiety'
        },
        {
          title: i18n._('Stress'),
          link: '/meditation-topics/stress'
        },
        {
          title: i18n._('Timer'),
          link: '/meditation-timer'
        },
        {
          title: i18n._('Music'),
          link: '/meditation-music'
        },
        {
          title: i18n._('for Parents'),
          link: '/meditation-topics/children'
        },
        {
          title: i18n._('See all'),
          link: '/meditation-topics'
        }
      ]
    },
    {
      title: i18n._('Yoga'),
      link: '/yoga'
    },
    {
      title: i18n._('Live'),
      link: '/live'
    },
    {
      title: 'MemberPlus',
      link: '/member-plus'
    },
    {
      title: i18n._('Circles for Teams'),
      link: '/teams'
    },
    {
      title: i18n._('Teachers'),
      link: '/meditation-teachers'
    },
    {
      title: i18n._('Term & Privacy'),
      link: '/terms-and-privacy'
    }
  ];

  return (
    <MenuContainer>
      <ul>
        {MenuList.map(m => {
          return (
            <li key={`${m.title}`}>
              <MobileLink
                to={m.link}
                onClick={onClose}
                interactionLocation={InteractionLocations.AppMenu}
              >
                {m.title}
                {m.title === 'Circles for Teams' && (
                  <>
                    <Box width="6px" />
                    <Box
                      padding="5px"
                      bgcolor="#06868a"
                      width="36px"
                      height="18px"
                      borderRadius="5px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text>NEW</Text>
                    </Box>
                  </>
                )}
              </MobileLink>

              {m.children && (
                <ul>
                  {m.children.map(c => (
                    <li key={`${c.title}`}>
                      <MobileLink
                        small
                        to={c.link}
                        onClick={onClose}
                        interactionLocation={InteractionLocations.AppMenu}
                      >
                        {c.title}
                      </MobileLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </MenuContainer>
  );
};

export default Menus;
