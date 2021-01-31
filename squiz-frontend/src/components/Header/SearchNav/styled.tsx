import styled from '@emotion/styled';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export const SearchPopover = styled.div`
  position: absolute;
  width: 750px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
`;

export const SearchButton = styled(IconButton)<{
  closebutton?: number;
}>`
  color: #181818;
  height: 40px;
  width: 40px;
  padding: 0;
  ${props => props.closebutton && 'margin-right: -42px;'}
  ${props => props.closebutton && 'margin-left: -5px;'}

  &:focus {
    outline: none;
  }
`;

export const StyledCloseIcon = styled(CloseIcon)`
  width: 24px;
  height: 24px;
`;
