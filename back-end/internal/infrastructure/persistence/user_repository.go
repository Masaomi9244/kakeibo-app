package persistence

import (
	"context"
	"fmt"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// UserRepository は開発用user_idに対応するusers行を用意する。
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository はusers repositoryを作成する。
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// EnsureDevelopmentUser は認証なし実装期間に固定user_idの外部キーを満たす。
func (r *UserRepository) EnsureDevelopmentUser(ctx context.Context, userID string) error {
	if userID == "" {
		return nil
	}

	user := userModel{
		ID:                 userID,
		AuthProviderUserID: "dev:" + userID,
		Email:              "dev-" + userID + "@example.local",
	}

	if err := r.db.WithContext(ctx).
		Clauses(clause.OnConflict{DoNothing: true}).
		Create(&user).Error; err != nil {
		return fmt.Errorf("ensure development user: %w", err)
	}

	return nil
}
