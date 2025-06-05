import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { withdrawAccount } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleWithdrawAccount = async () => {
    try {
      const response = await withdrawAccount(password);
      if (response.success) {
        logout();
        navigate('/login');
      } else {
        setError(response.message || '회원탈퇴 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Error withdrawing account:', err);
      setError('회원탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          내 프로필
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              기본 정보
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>이름:</strong> {user?.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>이메일:</strong> {user?.email}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>권한:</strong> {user?.role === 'ADMIN' ? '관리자' : '일반 사용자'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
              계정 삭제
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
              계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenWithdrawDialog(true)}
            >
              계정 삭제
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* 회원탈퇴 확인 다이얼로그 */}
      <Dialog
        open={openWithdrawDialog}
        onClose={() => setOpenWithdrawDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>계정 삭제 확인</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" sx={{ mb: 3 }}>
            계정을 삭제하시려면 비밀번호를 입력해주세요.
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenWithdrawDialog(false)}
            variant="outlined"
          >
            취소
          </Button>
          <Button
            onClick={handleWithdrawAccount}
            variant="contained"
            color="error"
            disabled={!password}
          >
            계정 삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 