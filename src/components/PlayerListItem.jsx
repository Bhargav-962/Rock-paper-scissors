import { Button, Chip, Stack, Typography } from "@mui/material"
import { PLAYER_STATUS, PLAYER_STATUS_LABELS } from "../constants"

export default function PlayerListItem({ player, idx, invitePlayer, isDisabled, isInvitationSent }) {
    return (
        <Stack key={player.id} direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography>{idx + 1}. {player.username}</Typography>
                <Chip
                    label={PLAYER_STATUS_LABELS[player.status]}
                    size="small"
                    color={player.status === PLAYER_STATUS.IN_GAME ? 'warning' : 'success'}
                />
            </Stack>
            <Button
                variant="contained"
                size="small"
                onClick={() => invitePlayer(player)}
                disabled={isDisabled}
                color={isInvitationSent ? 'secondary' : 'primary'}
            >
                {isInvitationSent ? 'Invitation Sent' : 'Play'}
            </Button>
        </Stack>
    )
}

